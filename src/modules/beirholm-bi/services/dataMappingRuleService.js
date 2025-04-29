import api from '@config/axiosConfig.js'
import Notify from '@helpers/toastNotifications.js'

export const createMappingRule = async (data) => {
  try {
    const res = await api.post('data/mapping/rule/', data)
    Notify.success('Mapping rule created')
    return res.data
  } catch (err) {
    Notify.error(err.response?.data?.message || 'Failed to create mapping rule')
    throw err
  }
}

export const mappingRuleById = async (id) => {
  try {
    const res = await api.get(`data/mapping/rule/${id}/`)
    return res.data?.data
  } catch (err) {
    Notify.error(err.response?.data?.message || 'Failed to fetch mapping rule')
    throw err
  }
}

export const updateMappingRule = async (id, data) => {
  try {
    const res = await api.put(`data/mapping/rule/${id}/`, data)
    Notify.success('Mapping rule updated')
    return res.data
  } catch (err) {
    Notify.error(err.response?.data?.message || 'Failed to update mapping rule')
    throw err
  }
}

export const uploadMappingExcel = async (fd) => {
  try {
    const res = await api.post('data/mapping/rule/upload/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    Notify.success('Mapping rules uploaded')
    return res.data
  } catch (err) {
    Notify.error(err.response?.data?.message || 'Failed to upload mapping rules')
    throw err
  }
}

export const downloadMappingSample = async () => {
  try {
    const res = await api.get('data/mapping/rule/download-sample/', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'mapping_rule_sample.xlsx')
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  } catch (err) {
    Notify.error(err.response?.data?.message || 'Failed to download sample file')
    throw err
  }
}
