import type { HttpContext } from '@adonisjs/core/http'
import Supplier from '#models/supplier'

export default class SupplierController {

  // Listar fornecedores do usuário
  async show({ auth, response }: HttpContext) {
    try {
      if (!auth.user) {
        return response.status(401).json({ message: 'Usuário não autenticado.' })
      }
      const user = auth.user!

      const suppliers = await Supplier
        .query()
        .where('user_id', user.id)

        console.log(suppliers)
      return { suppliers, message: 'Busca de fornecedores realizada.' }

    } catch (error) {
      console.log('ERRO AO BUSCAR FORNECEDORES:', error)
      return response.status(500).json({message: 'Erro ao buscar categorias.'})
    }
  }

 // 🧾 Criar fornecedor
  async store({ request, auth, response }: HttpContext) {
    try {
      if (!auth.user) {
        return response.status(401).json({ message: 'Usuário não autorizado.' })
      }

      const user = auth.user

      const data = request.only([
        'type',
        'company_name',
        'trade_name',
        'document',
        'email',
        'phone',
        'zip_code',
        'street',
        'number',
        'city',
        'state',
        'country',
        'pix_key',
        'bank',
        'agency',
        'account'
      ])

      // 🔍 Validação básica
      if (!data.company_name || !data.trade_name || !data.document) {
        return response.status(400).json({
          message: 'Razão social, nome fantasia e documento são obrigatórios.'
        })
      }

      // 🔍 Verificar duplicidade
      const exists = await Supplier.query()
        .where('user_id', user.id)
        .andWhere((query) => {
          query
            .where('company_name', data.company_name)
            .orWhere('trade_name', data.trade_name)
            .orWhere('document', data.document)
        })
        .first()

      if (exists) {
        return response.status(400).json({
          message: 'Fornecedor já cadastrado (razão social, nome fantasia ou documento).'
        })
      }

      // 💾 Criar fornecedor
      const supplier = await Supplier.create({
        ...data,
        user_id: user.id
      })

      return response.status(201).json({
        message: 'Fornecedor criado com sucesso.',
        supplier
      })

    } catch (error) {
      console.log('ERRO AO CRIAR FORNECEDOR:', error)

      return response.status(500).json({
        message: 'Erro ao criar fornecedor.'
      })
    }
  }

  // Deletar fornecedor
  async destroy({ params, response, auth }: HttpContext) {
    try {
      if (!auth.user) {
        return response.status(401).json({ message: 'Usuário não autenticado.' })
      }
      const user = auth.user!

      const supplier = await Supplier
        .query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      if (supplier.user_id !== user.id) {
        return response.status(403).json({ message: 'Não autorizado' })
      }
      await supplier.delete()

      return response.status(200).json({ message: 'Fornecedor removido' })
    } catch (error) {
      console.log('ERRO AO DELETAR FORNECEDOR', error)
      return response.status(500).json({message: 'Erro ao deletar fornecedor.'})
    }
  }
}