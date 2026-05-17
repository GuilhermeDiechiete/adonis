import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Transaction from '#models/transaction'
import Payments from '#models/payment'
import Category from '#models/category'

export default class TransactionsController {

// POST - CRIAR TRANSAÇÃO
async store({ auth, request, response }: HttpContext) {
  try {
    if (!auth.user) {
      return response.status(401).json({ message: 'Usuário não autenticado.' })
    }
    const user = auth.user!

    const data = request.only([
      'transaction_type',
      'date',
      'description',
      'category',
      'category_name',
      'supplier',
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
    const res = await first.save()

    transactions.push(first)

    // cria as demais parcelas (se houver)
    for (let i = atual + 1; i <= total; i++) {
      const installmentDate = baseDate.plus({ months: i - atual })

      const transaction = await Transaction.create({
        transaction_type: data.transaction_type,
        group_id: groupId,
        userId: user.id,
        date: installmentDate,
        description: data.description,
        category: data.category,
        category_name: data.category_name,
        supplier: data.supplier,
        payment: data.payment,
        current_installment: i,
        total_installment: total,
        status: data.status,
        amount: data.amount
      })

      transactions.push(transaction)
    }
    console.log(res)
    return response.status(200).json({ transactions, message: 'Transação criada com sucesso' })

  } catch (error) {
    console.log('ERRO AO CRIAR TRANSAÇÃO', error)
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
      const outputs = transactions.filter((item) => item.transaction_type === 'outputs')
      const inputs = transactions.filter((item) => item.transaction_type === 'inputs')

    return response.status(200).json({ outputs, inputs, message: 'Busca de transações realizada.'})

  } catch (error) {
    console.log('ERRO AO BUSCAR SAIDAS')
    return response.status(500).send({ message: 'Erro ao buscar saídas' })
  }
}

async total({ request, auth, response }: HttpContext) {
  try {
    if (!auth.user) {
      return response.status(401).json({ message: 'Usuário não autenticado.' })
    }

    const user = auth.user
    const year = request.input('year')

    const query = Transaction.query().where('user_id', user.id)

    if (year) {
      query.whereRaw('EXTRACT(YEAR FROM date) = ?', [Number(year)])
    }

    const transactions = await query

    // separa inputs e outputs
    const inputs = transactions.filter(t => t.transaction_type === 'inputs')
    const outputs = transactions.filter(t => t.transaction_type === 'outputs')

    // 🔥 base fixa de janeiro a dezembro
    const buildEmptyYear = () => {
      const result: Record<number, number> = {}
      for (let i = 1; i <= 12; i++) {
        result[i] = 0
      }
      return result
    }

    // agrupa por mês
    const groupByMonth = (items: any[]) => {
      const result: Record<number, number> = {}

      for (const item of items) {
        const month = new Date(item.date).getMonth() + 1

        result[month] = (result[month] || 0) + Number(item.amount)
      }

      return result
    }

    // 🔥 merge com base fixa (garante 1–12 sempre)
    const inputsByMonth = {
      ...buildEmptyYear(),
      ...groupByMonth(inputs)
    }

    const outputsByMonth = {
      ...buildEmptyYear(),
      ...groupByMonth(outputs)
    }

    const inputsTotal = inputs.reduce((sum, t) => sum + Number(t.amount), 0)
    const outputsTotal = outputs.reduce((sum, t) => sum + Number(t.amount), 0)

    const balance = inputsTotal - outputsTotal

    return response.status(200).json({
      inputs: {
        byMonth: inputsByMonth,
        total: inputsTotal
      },
      outputs: {
        byMonth: outputsByMonth,
        total: outputsTotal
      },
      balance: {
        total: balance
      },
      message: 'Resumo financeiro carregado'
    })

  } catch (error) {
    console.log('ERRO AO GERAR TOTAL', error)

    return response.status(500).send({
      message: 'Erro ao gerar resumo financeiro'
    })
  }
}

async categories({ request, auth, response }: HttpContext) {
  try {

    if (!auth.user) {
      return response.status(401).json({
        message: 'Usuário não autenticado.'
      })
    }

    const user = auth.user
    const year = Number(request.input('year'))

    // BUSCAR TRANSAÇÕES POR USUÁRIO E ANO SELECIONADO
    const transactions = await Transaction
      .query()
      .where('user_id', user.id)
      .whereRaw(
        'EXTRACT(YEAR FROM date) = ?',
        [year]
      )

    // BUSCA AS CATEGORIAS DO USUÁRIO
    const categories = await Category
      .query()
      .where('user_id', user.id)

    const categoryMap = new Map()

    for (const category of categories) {
      categoryMap.set(category.name, category.category)
    }

    const getCategoryType = (transaction: any) => {
      return categoryMap.get(transaction.category)
    }


    // LISTA DE TRANSAÇÕES DO TIPO INPUTS
    const inputsTransactions = transactions.filter(
      transaction => transaction.transaction_type === 'inputs'
    )

    // LISTA DE TRANSAÇÕES DO TIPO OUTPUTS
    const outputsTransactions = transactions.filter(
      transaction => transaction.transaction_type === 'outputs'
    )

    // SOMA DE INPUTS E OUTPUTS AO ANO
    const totalInputsByYear = inputsTransactions.reduce(
      (acc, transaction) => acc + Number(transaction.amount),
      0
    )
    const totalOutputsByYear = outputsTransactions.reduce(
      (acc, transaction) => acc + Number(transaction.amount),
      0
    )
    // INPUTS FIXED AO ANO
    const inputsFixedTransactions = inputsTransactions.filter(
      transaction => getCategoryType(transaction) === 'fixed'
    )

    // INPUTS VARIABLE AO ANO
    const inputsVariableTransactions = inputsTransactions.filter(
      transaction => getCategoryType(transaction) === 'variable'
    )

  // OUTPUTS FIXED
    const outputsFixedTransactions = outputsTransactions.filter(
      transaction => getCategoryType(transaction) === 'fixed'
    )

  // OUTPUTS VARIABLE
  const outputsVariableTransactions = outputsTransactions.filter(
    transaction => getCategoryType(transaction) === 'variable'
  )

    // =========================
    // TOTAL POR CATEGORY NAME
    // =========================

    const totalsInputsByCategory: Record<string, number> = {}
    const totalsOutputsByCategory: Record<string, number> = {}

    for (const transaction of transactions) {

      const categoryName = transaction.category

      // INPUTS
      if (transaction.transaction_type === 'inputs') {

        if (!totalsInputsByCategory[categoryName]) {
          totalsInputsByCategory[categoryName] = 0
        }

        totalsInputsByCategory[categoryName] += Number(transaction.amount)
      }

      // OUTPUTS
      if (transaction.transaction_type === 'outputs') {

        if (!totalsOutputsByCategory[categoryName]) {
          totalsOutputsByCategory[categoryName] = 0
        }

        totalsOutputsByCategory[categoryName] += Number(transaction.amount)
      }
    }
// =========================
// DEBUG TOTALS CATEGORY
// =========================

console.log('TOTAL INPUTS POR CATEGORY')
console.log(totalsInputsByCategory)

console.log('TOTAL OUTPUTS POR CATEGORY')
console.log(totalsOutputsByCategory)

// =========================
// DEBUG TRANSACTIONS
// =========================

console.log('INPUTS FIXED')
console.log(inputsFixedTransactions)

console.log('INPUTS VARIABLE')
console.log(inputsVariableTransactions)

console.log('OUTPUTS FIXED')
console.log(outputsFixedTransactions)

console.log('OUTPUTS VARIABLE')
console.log(outputsVariableTransactions)
    // =========================
    // RETURN
    // =========================

    return {

      totals: {

        inputs: {

          total: totalInputsByYear,

          fixed: inputsFixedTransactions.reduce(
            (acc, transaction) => acc + Number(transaction.amount),
            0
          ),

          variable: inputsVariableTransactions.reduce(
            (acc, transaction) => acc + Number(transaction.amount),
            0
          )
        },

        outputs: {

          total: totalOutputsByYear,

          fixed: outputsFixedTransactions.reduce(
            (acc, transaction) => acc + Number(transaction.amount),
            0
          ),

          variable: outputsVariableTransactions.reduce(
            (acc, transaction) => acc + Number(transaction.amount),
            0
          )
        },

        balance:
          totalInputsByYear -
          totalOutputsByYear
      },

      totalsByCategory: {

        inputs: totalsInputsByCategory,

        outputs: totalsOutputsByCategory
      },

      transactions: {

        inputs: {

          fixed: inputsFixedTransactions,

          variable: inputsVariableTransactions
        },

        outputs: {

          fixed: outputsFixedTransactions,

          variable: outputsVariableTransactions
        }
      }
    }



  } catch (error) {

    console.log(error)

    return response.status(500).json({
      message: 'Erro ao carregar resumo financeiro'
    })
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