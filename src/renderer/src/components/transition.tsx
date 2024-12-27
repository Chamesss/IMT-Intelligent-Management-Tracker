import { motion } from 'framer-motion'
import React from 'react'

export default function Transition({
  children,
  trigger,
  className = ''
}: {
  children: React.ReactNode
  trigger: string | number
  className?: string
}) {
  return (
    <motion.div
      key={trigger}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
