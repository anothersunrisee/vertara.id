import { useEffect, useState } from 'react'
import { supabase } from '../src/utils/supabaseClient'

export function TodoList() {
    const [todos, setTodos] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                setLoading(true)
                const { data, error } = await supabase.from('todos').select('*')

                if (error) {
                    console.error('Supabase error:', error)
                    setError(error.message)
                } else {
                    setTodos(data || [])
                }
            } catch (err: any) {
                console.error('Unexpected error:', err)
                setError(err.message || 'An unexpected error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchTodos()
    }, [])

    return (
        <div className="p-4 border rounded shadow-sm bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4">Todo List (Supabase Test)</h2>

            {loading && <p>Loading...</p>}

            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
                    Error: {error}
                    <p className="text-sm mt-1">Make sure you have created the 'todos' table in Supabase.</p>
                </div>
            )}

            {!loading && !error && todos.length === 0 && (
                <p className="text-gray-500">No todos found.</p>
            )}

            <ul className="list-disc pl-5">
                {todos.map((todo) => (
                    <li key={todo.id || JSON.stringify(todo)} className="mb-1">
                        {todo.title || JSON.stringify(todo)}
                    </li>
                ))}
            </ul>
        </div>
    )
}
