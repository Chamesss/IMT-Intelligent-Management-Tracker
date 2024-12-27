import { AxiosInstance } from 'axios'
import { createContext, useCallback, useState } from 'react'

export const CompanyContext = createContext<any | undefined>(undefined)
export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState<Company | undefined>()

  const fetchCompany = useCallback(async (api: AxiosInstance) => {
    try {
      const response = await api.get('/api/company/company')
      setCompany(response.data.company as Company)
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <CompanyContext.Provider value={{ company, fetchCompany }}>{children}</CompanyContext.Provider>
  )
}
