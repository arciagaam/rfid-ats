function formatDate(date = new Date()) {
    const year = date.toLocaleString('default', { year: 'numeric' })
    const month = date.toLocaleString('default', {
        month: '2-digit',
    })
    const day = date.toLocaleString('default', { day: '2-digit' })

    return [year, month, day].join('-')
}

const formatTime = (time: string) => {
    if (time) {
        const date = new Date(time)
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
    return 'N/A'
}

export { formatDate, formatTime }
