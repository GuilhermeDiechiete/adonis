import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class SessionsController {
  // Login usuario
  async store({ request, auth, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      const user = await User.verifyCredentials(email, password)

      const token = await auth.use('api').createToken(user)

      return response.status(200).json({
        message: 'Login realizado com sucesso',
        type: user.clientType,
        token: token.value!.release()
      })
    } catch (error) {
      console.log('ERRO AO REALIZAR LOGIN', error)
      return response.status(401).json({ message: 'Email ou senha inválidos.' })
    }
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()

    return response.status(200).json({
      message: 'Logout realizado com sucesso'
    })
  }
}