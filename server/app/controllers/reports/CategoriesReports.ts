import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'

export default class ReportsCategoriesController {

async getReports({ request, auth, response }: HttpContext) {

  try {
    // autenticação de usuário
    if (!auth.user) {
      return response.status(401).json({message: 'Usuário não autenticado' })
    }

        // Totais outputs por mês
    const outputsByMonth = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0
    }

    // Totais inputs por mês
    const inputsByMonth = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0
    }
    const user = auth.user

    const year = Number(request.input('year'))
    const month = String(request.input('month'))

    // Lista total de transações (inputs e outputs) no ano selecionado
    const transactions = await Transaction.query().where('user_id', user.id)
        .whereRaw('EXTRACT(YEAR FROM date) = ?',[year]).orderBy('date', 'asc')
   
    // Separar listas de inputs e outputs pelo ano selecionado
    const outputs = transactions.filter((item) => item.transaction_type === 'outputs')
    const inputs = transactions.filter((item) => item.transaction_type === 'inputs')

    // Soma o total de despesas do ano
    const totalOutputsYear = outputs.reduce((total, item) => {
        return total + Number(item.amount)
    },0)
    // Soma o total de receitas do ano
    const totalInputsYear = inputs.reduce((total, item) => {
        return total + Number(item.amount)
    },0)

    // Transações despesas fixas e variaveis no ano
    const outputsFixedYear = outputs.filter((item) => item.category === 'fixed')
    const outputsVariableYear = outputs.filter((item) => item.category === 'variable')

    // Transações entradas fixas e variaveis no ano
    const inputsFixedYear = inputs.filter((item) => item.category === 'fixed')
    const inputsVariableYear = inputs.filter((item) => item.category === 'variable')

    // Somar totais de fixed e variable no ano
    const totalOutputsFixedYear = outputsFixedYear.reduce((total, item) => {
        return total + Number(item.amount)
    },0)
        const totalOutputsVariableYear = outputsVariableYear.reduce((total, item) => {
        return total + Number(item.amount)
    },0)
        const totalInputsFixedYear = inputsFixedYear.reduce((total, item) => {
        return total + Number(item.amount)
    },0)
        const totalInputsVariableYear = inputsVariableYear.reduce((total, item) => {
        return total + Number(item.amount)
    },0)

    // somar transações por mês da lista de outputs
    outputs.forEach((transaction) => {
    const month = transaction.date.month
    outputsByMonth[ month as keyof typeof outputsByMonth
    ] += Number(transaction.amount)
    })
    // somar transações por mês da lista de inputs
    inputs.forEach((transaction) => {
    const month = transaction.date.month
    inputsByMonth[ month as keyof typeof inputsByMonth
    ] += Number(transaction.amount)
    })
 


    // ======================================
// OUTPUTS - categorias resumidas
// ======================================

const outputsCategoriesSummary: any[] = []

const uniqueOutputsCategories = [
  ...new Set(
    outputs.map((item) => item.category_name)
  )
]

uniqueOutputsCategories.forEach((categoryName, index) => {

  const categoryTransactions =
    outputs.filter(
      (item) =>
        item.category_name === categoryName
    )

  const months = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0
  }

  categoryTransactions.forEach((transaction) => {

    const month = transaction.date.month

    months[
      month as keyof typeof months
    ] += Number(transaction.amount)

  })

  const totalYear =
    categoryTransactions.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    )

  outputsCategoriesSummary.push({

    id: index + 1,

    category:
      categoryTransactions[0].category,

    category_name: categoryName,

    months,

    totalYear
  })
})

// ======================================
// INPUTS - categorias resumidas
// ======================================

const inputsCategoriesSummary: any[] = []

const uniqueInputsCategories = [
  ...new Set(
    inputs.map((item) => item.category_name)
  )
]

uniqueInputsCategories.forEach((categoryName, index) => {

  const categoryTransactions =
    inputs.filter(
      (item) =>
        item.category_name === categoryName
    )

  const months = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0
  }

  categoryTransactions.forEach((transaction) => {

    const month = transaction.date.month

    months[
      month as keyof typeof months
    ] += Number(transaction.amount)

  })

  const totalYear =
    categoryTransactions.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    )

  inputsCategoriesSummary.push({

    id: index + 1,

    category:
      categoryTransactions[0].category,

    category_name: categoryName,

    months,

    totalYear
  })
})


// OUTPUTS - categoria com maior gasto ano e mês
const topOutputCategoryYear = outputsCategoriesSummary.reduce((prev, current) => {
  return current.totalYear > prev.totalYear ? current : prev
})

const topOutputCategoryMonth = outputsCategoriesSummary.reduce((prev, current) => {
  const currentValue = current.months[month] || 0
  const prevValue = prev.months[month] || 0

  return currentValue > prevValue ? current : prev
})

// INPUTS - categoria com maior entrada no ano e mês
const topInputCategoryYear = inputsCategoriesSummary.reduce((prev, current) => {
  return current.totalYear > prev.totalYear ? current : prev
})

const topInputCategoryMonth = inputsCategoriesSummary.reduce((prev, current) => {
  const currentValue = current.months[month] || 0
  const prevValue = prev.months[month] || 0

  return currentValue > prevValue ? current : prev
})

const topCategories = {
  outputs: {
    year: {
      category_name: topOutputCategoryYear.category_name,
      totalYear: topOutputCategoryYear.totalYear
    },

    month: {
      category_name: topOutputCategoryMonth.category_name,
      totalMonth: topOutputCategoryMonth.months[month] || 0
    }
  },

  inputs: {
    year: {
      category_name: topInputCategoryYear.category_name,
      totalYear: topInputCategoryYear.totalYear
    },

    month: {
      category_name: topInputCategoryMonth.category_name,
      totalMonth: topInputCategoryMonth.months[month] || 0
    }
  }
}
    return response.status(200).json({ 
        totalInputsYear, 
        totalInputsFixedYear,
        totalInputsVariableYear,

        totalOutputsYear,
        totalOutputsFixedYear,
        totalOutputsVariableYear,
        
        outputsByMonth,
        inputsByMonth,

        outputsCategoriesSummary,
        inputsCategoriesSummary,

        topCategories,
      
        message: 'Relatório carregado com sucesso' })
 
  } catch (error) {
    console.log(error)
    return response.status(500).json({
      message: 'Erro ao carregar relatório'
    })
  }
}

}
