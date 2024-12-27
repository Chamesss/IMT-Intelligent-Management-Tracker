export const getProfilePictureSrc = (profilePicture: string, name: string) => {
  if (profilePicture && profilePicture !== '' && profilePicture !== 'undefined') {
    return profilePicture
  }

  // Generate a placeholder image with the first letter of the user's name
  if (!name || name === '') {
    return ''
  }
  const firstLetter = name.charAt(0).toUpperCase()
  const placeholderColor = '#dbdbdb'

  // Create a data URL for the placeholder image
  const canvas = document.createElement('canvas')
  canvas.width = 110 // size of the placeholder image
  canvas.height = 110
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = placeholderColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000' // Text color
    ctx.font = 'bold 50px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(firstLetter, canvas.width / 2, canvas.height / 2)
  }

  // Return the data URL
  return canvas.toDataURL()
}
