import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Transaction from '#models/transaction'
import Payments from '#models/payment'

export default class TransactionsController {

// POST - CRIAR TRANSAÇÃO
async store({ auth, request, response }: HttpContext) {
  try {
    if (!auth.user) {
      return response.status(401).json({ message: 'Usuário não autenticado.' })
    }
    const user = auth.user!

    const data = request.only([
      'type',
      'date',
      'description',
      'category',
      'payment',
      'current_installment',
      'total_installment',
      'status',
      'amount'
    ])

    const total = Number(data.total_installment) || 1
    const atual = Number(data.current_installment)
    const baseDate = DateTime.fromISO(data.date)
    const transactions = []

    // cria a primeira parcela com group_id = 0 (temporário)
    const first = await Transaction.create({
      ...data,
      group_id: 0,
      userId: user.id,
    })

    // group_id será o ID da primeira parcela
    const groupId = first.id

    // atualiza a primeira para ter group_id correto
    first.group_id = groupId
    await first.save()

    transactions.push(first)

    // cria as demais parcelas (se houver)
    for (let i = atual + 1; i <= total; i++) {
      const installmentDate = baseDate.plus({ months: i - atual })

      const transaction = await Transaction.create({
        group_id: groupId,
        userId: user.id,
        date: installmentDate,
        description: data.description,
        category: data.category,
        payment: data.payment,
        current_installment: i,
        total_installment: total,
        status: data.status,
        amount: data.amount
      })

      transactions.push(transaction)
    }
    return response.status(200).json({ transactions, message: 'Transação criada com sucesso' })

  } catch (error) {
    console.log('ERRO AO CRIAR TRANSAÇÃO')
    return response.status(500).send({ message: 'Erro ao criar transação' })
  }
}

// BUSCAR E FILTRAR DUAS LISTAS DE TRANSAÇÃO (ENTRADAS E SAIDAS)
async show({ request, auth, response }: HttpContext) {
  try {
    if (!auth.user) {
      return response.status(401).json({ message: 'Usuário não autenticado.' })
    }
    const user = auth.user!

    const year = request.input('year')
    const month = request.input('month')

    // Buscar todas as transações do usuário
    const query = Transaction.query().where('user_id', user.id)

    if (year) {
      query.whereRaw('EXTRACT(YEAR FROM date) = ?', [Number(year)])
    }
    if (month) {
      query.whereRaw('EXTRACT(MONTH FROM date) = ?', [Number(month)])
    }

    const transactions = await query.orderBy('date', 'desc')

    // Separar listas
      const outputs = transactions.filter((item) => item.type === 'output')
      const inputs = transactions.filter((item) => item.type === 'input')

    return response.status(200).json({ outputs, inputs, message: 'Busca de transações realizada.'})

  } catch (error) {
    console.log('ERRO AO BUSCAR SAIDAS')
    return response.status(500).send({ message: 'Erro ao buscar saídas' })
  }
}



// ATUALIZA STATUS DE TRANSAÇÕES (paid || pending)
async update({ params, request, response, auth }: HttpContext) {
  try {
    if (!auth.user) {
      return response.status(401).json({ message: 'Usuário não autenticado.' })
    }
    const user = auth.user!

    const output = await Transaction
      .query()
      .where('id', params.id)
      .where('user_id', user.id)
      .firstOrFail()

    const newStatus = request.input('status')

    if (!['paid', 'pending'].includes(newStatus)) {
      return response.status(400).json({ message: 'Status inválido' })
    }

    // Busca o payment
    const payment = await Payments
      .query()
      .where('name', output.payment)
      .where('user_id', user.id)
      .firstOrFail()

    // Se for agrupado
    if (payment.group === true) {

      const year = output.date.year
      const month = output.date.month

      await Transaction
        .query()
        .where('user_id', user.id)
        .where('payment', output.payment)
        .whereRaw('EXTRACT(YEAR FROM date) = ?', [year])
        .whereRaw('EXTRACT(MONTH FROM date) = ?', [month])
        .update({ status: newStatus })

    } else {
      // Atualiza só a transação atual
      output.status = newStatus
      await output.save()
    }
    return response.status(200).json({ message: 'Status atualizado com sucesso' })

  } catch (error) {
    console.log('ERRO AO ALTERAR STATUS')
    return response.status(400).send({ message: 'Erro ao alterar status' })
  }
}

async destroy({ params, response, auth }: HttpContext) {
  try {
    if (!auth.user) {
      return response.status(401).json({ message: 'Usuário não autenticado.' })
    }
    const user = auth.user!

    const id = Number(params.id)
    const futures = params.futures === 'true'

    const output = await Transaction
      .query()
      .where('id', id)
      .where('user_id', user.id)
      .firstOrFail()

    if (futures) {

      await Transaction
        .query()
        .where('group_id', output.group_id)
        .where('current_installment', '>=', output.current_installment)
        .where('user_id', user.id)
        .delete()

      return response.status(200).json({ message: 'Transações futuras removidas' })

    } else {
      await output.delete()
      return response.status(200).json({ message: 'Transação removida' })
    }
  } catch (error) {
    console.log('ERRO AO DELETAR TRANSAÇÃO')
    return response.status(400).send({ message: 'Erro ao deletar transação' })
  }
}
}