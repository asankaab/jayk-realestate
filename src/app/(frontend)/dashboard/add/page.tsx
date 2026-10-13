import { createProperty } from '../actions'
import { PropertyForm } from '../PropertyForm'

export default function AddPropertyPage() {
  return (
    <div>
      <PropertyForm onSubmit={createProperty} title="Add New Property" />
    </div>
  )
}
