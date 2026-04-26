import type { HttpContext } from '@adonisjs/core/http'
import Payment from '#models/payment'

export default class PaymentController {

  // LISTAR opções de pagamento do usuário
  async show({ auth, response }: HttpContext) {
    try {
      if (!auth.user) {
        return response.status(401).json({ message: 'Usuário não autenticado.' })
      }
      const user = auth.user!

      const inputs = await Payment
        .query()
        .where('user_id', user.id)
        .where('type', 'inputs')

      const outputs = await Payment
        .query()
        .where('user_id', user.id)
        .where('type', 'outputs')

      const investments = await Payment
        .query()
        .where('user_id', user.id)
        .where('type', 'investments')
        
      return {
        inputs,
        outputs,
        investments,
        message: 'Busca por opções de pagamento realizada.'
      }
    } catch (error) {
      console.log('ERRO AO BUSCAR FORMAS DE PAGAMENTO:', error)
      return response.status(500).send({ message: 'Erro ao buscar formas de pagamento.' })
    }
  }


  // Criar forma de pagamento
  async store({ request, auth, response }: HttpContext) {
    try {
      if (!auth.user) {
        return response.status(401).json({ message: 'Usuário não autenticado.' })
      }
      const user = auth.user!
      const data = request.only(['type', 'name', 'group'])

      // VERIFICA SE JÁ EXISTE
      const exists = await Payment
          .query().where('user_id', user.id)
          .where('name', data.name)
          .where('type', data.type)
          .first()

      if (exists) {
          return response.status(400).json({message: 'Forma de pagamento já existe.'})
      }

      await Payment.create({
          ...data,
          userId: user.id
      })
      return response.status(200).json({ message: 'Forma de pagamento criada com sucesso.'})

    } catch (error) {
      console.log('ERRO AO CRIAR FORMAS DE PAGAMENTO:', error)
      return response.status(500).send({ message: 'Erro ao criar formas de pagamento.' })
    }
    
    }
  // DELETAR categoria
  async destroy({ params, response, auth }: HttpContext) {
    try {
      if (!auth.user) {
        return response.status(401).json({ message: 'Usuário não autenticado.' })
      }
      const user = auth.user!

      const payment = await Payment
        .query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      if (payment.userId !== user.id) {
        return response.status(403).json({ message: 'Não autorizado' })
      }
      await payment.delete()

      return response.status(200).json({ message: 'Forma de pagamento removida' })
    } catch (error) {
      console.log('ERRO AO DELETAR FORMAS DE PAGAMENTO:', error)
      return response.status(500).send({ message: 'Erro ao deletar formas de pagamento.' })
    }
  }
}