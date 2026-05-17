import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'

type CategorySummary = {
  category_name: string
  months: Record<number, number>
}

export default class ReportsCategoriesController {

async getReports({ request, auth, response }: HttpContext) {

  try {
    if (!auth.user) {
      return response.status(401).json({message: 'Usuário não autenticado' })
    }
    const user = auth.user

    const year = Number(request.input('year'))

    const transactions = await Transaction.query().where('user_id', user.id)
        .whereRaw('EXTRACT(YEAR FROM date) = ?',[year]).orderBy('date', 'asc')
   
    // Separar listas
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

    // ======================================
    // OUTPUTS FIXED - Somar o total de categorias por mês
    // ======================================

    const outputsFixedSummary: CategorySummary[] = []

    // Categorias únicas
    const uniqueCategories = [
    ...new Set( outputsFixedYear.map((item) => item.category_name ))]

    // Loop categorias
    uniqueCategories.forEach((categoryName) => {

    // Filtra transações categoria
    const categoryTransactions = outputsFixedYear.filter((item) => item.category_name === categoryName)

    // Estrutura meses
    const months: Record<number, number> = {}

    // Inicializa meses
    for (let month = 1; month <= 12; month++) {
        months[month] = 0
    }
    // Soma valores
    categoryTransactions.forEach((transaction) => {

    const month = transaction.date.month
    months[month] += Number(transaction.amount)})

    // Adiciona resultado
    outputsFixedSummary.push({ category_name: categoryName, months })

    })

    // ======================================
    // OUTPUTS FIXED MONTHS
    // ======================================

    const outputsFixedMonths = Array.from(
    { length: 12 },
    (_, index) => ({

        month: index + 1,

        transactions:
        outputsFixedYear
            .filter(
            (item) =>
                item.date.month === index + 1
            )
            .map((item) => ({

            id: item.id,

            category: item.category,
            description: item.description,
            current_installment: item.current_installment,
            total_installment: item.total_installment,
            amount: Number(item.amount),
            date: item.date.toISODate() }))
    }))
    return response.status(200).json({ 
        totalOutputsYear,
        totalInputsYear, 

        totalOutputsFixedYear,
        totalOutputsVariableYear,
        totalInputsFixedYear,
        totalInputsVariableYear,

        outputsFixedSummary,
        outputsFixedMonths,

        message: 'Relatório carregado com sucesso' })
 
  } catch (error) {
    console.log(error)
    return response.status(500).json({
      message: 'Erro ao carregar relatório'
    })
  }
}

}
