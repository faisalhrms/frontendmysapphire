import api from '@config/axiosConfig.js'
import Notify from '@helpers/toastNotifications.js'

const BASE = 'customer-hub/configs/'

export const getHubConfig = async (id) => {
  const res = await api.get(`${BASE}${id}`)
  return res.data?.data || res.data
}

export const getCurrentHubConfig = async (mailbox_email) => {
  const res = await api.get(`${BASE}current`, { params: { mailbox: mailbox_email } })
  return res.data?.data || res.data
}

export const createHubConfig = async (data) => {
  const res = await api.post(BASE, data)
  Notify.success('Configuration created')
  return res.data?.data || res.data
}

export const updateHubConfig = async (id, data) => {
  const res = await api.put(`${BASE}${id}/`, data)
  Notify.success('Configuration updated')
  return res.data?.data || res.data
}
