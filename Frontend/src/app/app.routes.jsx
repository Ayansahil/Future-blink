import { Routes, Route, Navigate } from 'react-router-dom'
import FlowPage from '../features/flow/pages/FlowPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/flow" replace />} />
      <Route path="/flow" element={<FlowPage />} />
    </Routes>
  )
}