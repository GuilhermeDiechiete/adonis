import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {

/* CRIAR USUÁRIO NO DB */
async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
          'full_name',
          'username',
          'birth',
          'phone',
          'email',
          'password',
          'confirm_password',
        ])

      // verificação na criação de senha
      if (data.password !== data.confirm_password) {
        return response.status(400).json({ message: 'As senhas não conferem.' })
      }

      // verificação de duplicidade de usuário
      const usernameExists = await User.findBy('username', data.username)
      if (usernameExists) {
        return response.status(400).json({ message: 'Nome de usuário já está em uso.' })
      }

      // verificação se o e-mail já esta em uso no sistema.
      const emailExists = await User.findBy('email', data.email)
      if (emailExists) {
        return response.status(400).json({ message: 'Email já está em uso.' })
      }

      // ajuste para enviar para o DB
      const { confirm_password, ...userData } = data
     
      await User.create({
        ...userData,
        role: 'user', // criação como usuário comum do sistema
        isActive: true, // inicia no sistema com acesso ativo
      })

      return response.status(200).json({ message: 'Usuário criado com sucesso.' })

    } catch (error) {
      console.log('ERRO AO CRIAR USUÁRIO')
      return response.status(500).json({
        message: 'Erro ao criar usuário.',
      })
    }
  }

  /*BUSCAR USUARIO*/
  async show({ params, auth, response }: HttpContext) {
    try {
      const user = auth.user

      // Verifica se o usuário está autenticado
      if (!user) {
        return response.status(401).json({ message: 'Sem autorização de acesso.' })
      }
  
      // Garante que está acessando seu próprio perfil (segurança)
      if (user.id !== Number(params.id)) {
        return response.status(403).json({ message: 'Acesso negado.' })
      }
  
      await User.findByOrFail('id', user.id)
      return response.status(200).json({ email: user.email })
  
    } catch (error) {
      console.error('ERRO AO BUSCAR USUÁRIO' )
      return response.status(400).json({ message: 'Erro ao buscar usuário.' })
    }
  }
  

  public async update({}: HttpContext) {}

  public async destroy({}: HttpContext) {}
}