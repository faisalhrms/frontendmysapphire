const getYearOptions = (start, end) =>
  Array.from(
    { length: end - start + 1 },
    (_, i) => {
      const year = start + i
      return { value: year.toString(), label: year.toString() }
    }
  )

export const yearDashboard = getYearOptions(2024, new Date().getFullYear())


export const monthDashboard = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

export const getSlaBadgeClasses = (slaHours) => {
        if (slaHours >= 48) {
            return "bg-green-500/10 text-green-500 px-2 py-1 rounded-md";
        } else if (slaHours >= 24) {
            return "bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-md";
        } else if (slaHours > 0) {
            return "bg-red-500/10 text-red-500 px-2 py-1 rounded-md";
        }
        return "bg-gray-500/10 text-gray-500 px-2 py-1 rounded-md";
    };

export const getAttachmentIcon = (fileType) => {
  if (!fileType) return 'ri-file-text-line'
  if (fileType === 'application/pdf') return 'ri-file-pdf-line'
  if (fileType.startsWith('image/')) return 'ri-image-line'
  if (fileType.startsWith('video/')) return 'ri-video-line'
  if (fileType.startsWith('audio/')) return 'ri-volume-up-line'
  if (fileType.includes('word')) return 'ri-file-word-2-line'
  if (fileType.includes('excel') || fileType.includes('spreadsheet') || fileType.includes('sheet')) return 'ri-file-excel-2-line'
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'ri-file-ppt-2-line'
  if (fileType.includes('zip') || fileType.includes('compressed')) return 'ri-file-zip-line'
  return 'ri-file-text-line'
}


export const getAttachmentColor = (fileType) => {
  if (!fileType) return '!text-gray-500'
  if (fileType === 'application/pdf') return '!text-rose-500'
  if (fileType.startsWith('image/')) return '!text-amber-500'
  if (fileType.startsWith('video/')) return '!text-red-500'
  if (fileType.startsWith('audio/')) return '!text-emerald-500'
  if (fileType.includes('word')) return '!text-sky-600'
  if (fileType.includes('excel') || fileType.includes('spreadsheet') || fileType.includes('sheet')) return '!text-lime-600'
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '!text-amber-700'
  if (fileType.includes('zip') || fileType.includes('compressed')) return '!text-fuchsia-600'
  return '!text-gray-500'
}

export const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 B'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
