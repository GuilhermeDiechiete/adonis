import router from "@adonisjs/core/services/router"
import { controllers } from "#generated/controllers"
import { middleware } from '#start/kernel'

// ROTAS DE USUÁRIOS
router.group(() => {
  router.post('/', [controllers.Users, 'store'])// Requisição POST (cadastro de usuário -> não precisa de autenticação 
  router.group(() => { // Rotas que precisa de autenticação do usuário (params :id)
    router.get('/', [controllers.Users, 'get']) // buscar dados de usuário
    router.put('/:id', [controllers.Users, 'update']) // editar dados de usuário
    router.delete('/:id', [controllers.Users, 'destroy']) // deletar usuário
  })
    .where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })
    .use(middleware.auth({ guards: ['api'] }))
}).prefix('/users')