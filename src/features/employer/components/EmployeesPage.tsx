import { useEmployees } from '../hooks/useEmployees'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/custom/TableSkeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function EmployeesPage() {
  const { data: employees, isLoading, error } = useEmployees()

  if (isLoading) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error.message || 'Failed to load employees'}
        </AlertDescription>
      </Alert>
    )
  }

  if (!employees || employees.length === 0) {
    return (
      <Alert>
        <AlertDescription>No employees found</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member No</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>All Names</TableHead>
                <TableHead>ID Number</TableHead>
                <TableHead>PIN Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.member_no}>
                  <TableCell>{employee.member_no}</TableCell>
                  <TableCell>{employee.first_name}</TableCell>
                  <TableCell>{employee.last_name}</TableCell>
                  <TableCell>{employee.all_names}</TableCell>
                  <TableCell>{employee.id_no}</TableCell>
                  <TableCell>{employee.pin_no}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
