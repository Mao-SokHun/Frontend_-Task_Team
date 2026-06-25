import { createContext, useContext } from 'react'

const LanguageContext = createContext({ locale: 'en', t: (key) => key })

export function LanguageProvider({ children }) {
  return (
    <LanguageContext.Provider value={{ locale: 'en', t: (key) => key }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
