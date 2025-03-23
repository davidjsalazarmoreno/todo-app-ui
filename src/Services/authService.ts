import axios from 'axios'

export const login = async (username: string, password: string) => {
  const response = await axios.post(
    `${import.meta.env.VITE_REACT_APP_API_PREFIX}/api/v1/login`,
    { username, password }
  )
  return response.data
}

export const logout = async (token: string) => {
  const response = await axios.post(
    `${import.meta.env.VITE_REACT_APP_API_PREFIX}/api/v1/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}
