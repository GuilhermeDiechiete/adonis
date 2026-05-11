import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'

export default class CategoryController {

  // Listar categorias do usuário por tipo (inputs, outputs, investments)
  async index({ auth, response }: HttpContext) {
    try {
      if (!auth.user) {
        return response.status(401).json({ message: 'Usuário não autenticado.' })
      }
      const user = auth.user!

      const inputs = await Category
        .query()
        .where('user_id', user.id)
        .where('transaction_type', 'inputs')

      const outputs = await Category
        .query()
        .where('user_id', user.id)
        .where('transaction_type', 'outputs')

      const investments = await Category
        .query()
        .where('user_id', user.id)
        .where('transaction_type', 'investments')

      return { inputs, outputs, investments, message: 'Busca de categorias realizada.' }

    } catch (error) {
      console.log('ERRO AO BUSCAR CATEGORIAS:', error)
      return response.status(500).json({message: 'Erro ao buscar categorias.'})
    }
  }

  // Criar categoria
  async store({ request, auth, response }: HttpContext) {
    try {
      if (!auth.user) {
          return response.status(401).json({ message: 'Usuário não autorizado.' })
        }
      const user = auth.user!

      const data = request.only(['category', 'transaction_type', 'name'])
  
      if(!data.name) response.status(400).json({ message: 'Nome da categoria é obrigatório.'})
        
      // VERIFICA SE JÁ EXISTE
      const exists = await Category
          .query().where('user_id', user.id)
          .where('name', data.name)
          .where('transaction_type', data.transaction_type)
          .first()

      if (exists) {
          return response.status(400).json({message: 'Categoria já existe.'})
      }

      await Category.create({
          ...data,
          userId: user.id
      })
      return response.status(200).json({ message: 'Categoria criada com sucesso.'})

    } catch (error) {
      console.log('ERRO AO CRIAR CATEGORIA', error)
      return response.status(500).json({message: 'Erro ao criar categoria.'})
    }
  }
  // Deletar categoria
  async destroy({ params, response, auth }: HttpContext) {
    try {
      if (!auth.user) {
        return response.status(401).json({ message: 'Usuário não autenticado.' })
      }
      const user = auth.user!

      const category = await Category
        .query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      if (category.userId !== user.id) {
        return response.status(403).json({ message: 'Não autorizado' })
      }
      await category.delete()

      return response.status(200).json({ message: 'Categoria removida' })
    } catch (error) {
      console.log('ERRO AO DELETAR CATEGORIA', error)
      return response.status(500).json({message: 'Erro ao deletar categoria.'})
    }
  }
}