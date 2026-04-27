import { createProperty } from '../actions'
import { PropertyForm } from '../PropertyForm'

export default function AddPropertyPage() {
  return (
    <div className="wrapper" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <PropertyForm onSubmit={createProperty} title="Add New Property" />
    </div>
  )
}
