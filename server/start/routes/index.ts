import router from '@adonisjs/core/services/router'

import './users.routes.ts'
import './sessions.routes.ts'
import './categories.routes.ts'
import './payment_method.routes.ts'
import './transactions.routes.ts'
import './suppliers.routes.ts'

router.get('/main', async () => {
  return { hello: 'tcf' }
})