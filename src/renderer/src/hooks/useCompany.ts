import { CompanyContext } from '@/contexts/company-context'
import { useContext } from 'react'

export const useCompany = () => {
  const context = useContext(CompanyContext)
  if (!context) {
    throw new Error('useCompany must be used within an CompanyProvider')
  }
  return context
}
