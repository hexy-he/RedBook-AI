import { handleIntent } from '../server/complianceApi.js'
import { apiRoute } from './_utils.js'

export default apiRoute(handleIntent)
