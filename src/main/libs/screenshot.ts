import { screen } from 'electron'
import { Monitor } from 'node-screenshots'
import sharp from 'sharp'
import log from '../utils/logger'

export default async function captureScreen(): Promise<Buffer | boolean> {
  try {
    const displays = screen.getAllDisplays()
    const monitors = Monitor.all()

    let cursorX = screen.getCursorScreenPoint().x
    let dif = 0

    displays.forEach((display, index) => {
      if (display.scaleFactor !== 1) {
        dif = displays[index].bounds.width * display.scaleFactor - displays[index].bounds.width
        displays[index].bounds.width = displays[index].bounds.width * display.scaleFactor
        for (let i = index; i < displays.length; i++) {
          displays[i].bounds.x += dif
        }
      }
    })

    const monitor = monitors.find((monitor) => {
      return cursorX + dif >= monitor.x && cursorX + dif <= monitor.x + monitor.width
    })

    if (monitor) {
      const img = await (await monitor.captureImage()).toPng()
      const resizedBuffer = await sharp(img)
        .resize({ width: Math.floor(monitor.width / 2), height: Math.floor(monitor.height / 2) })
        .webp({ quality: 90 })
        .toBuffer()
      return resizedBuffer
    } else {
      log.warn('Screenshot: Falling back to default monitor')
      const img = await (await monitors[0].captureImage()).toPng()
      const resizedBuffer = await sharp(img)
        .resize({
          width: Math.floor(monitors[0].width / 2),
          height: Math.floor(monitors[0].height / 2)
        })
        .webp({ quality: 90 })
        .toBuffer()
      return resizedBuffer
    }
  } catch (error) {
    log.warn(`Screenshot capture failed, error:${JSON.stringify(error)}`)
    return false
  }

  //   let screenCaptured: boolean | Buffer = false
  //   const cursorPoint = screen.getCursorScreenPoint()
  //   ScreenShot.listDisplays().then(async (displays) => {
  //     const display = displays.find((display) => {
  //       //@ts-ignore
  //       return cursorPoint.x >= display.left && cursorPoint.x <= display.right
  //     })
  //     await ScreenShot({ screen: display?.id })
  //       .then(async (img) => {
  //         await sharp(img)
  //           .resize({
  //             //@ts-ignore
  //             width: Math.floor(display?.width / 2),
  //             //@ts-ignore
  //             height: Math.floor(display?.height / 2)
  //           })
  //           .webp({ quality: 90 })
  //           .toBuffer()
  //           .then((data) => {
  //             trackerStore.set('trackerScreenshots', data.toString('base64'))
  //             screenCaptured = data
  //             return screenCaptured
  //           })
  //           .catch((err) => {
  //             new Notification({ title: 'image resizing error encountered', body: err }).show()
  //           })
  //       })
  //       .catch((err) => {
  //         new Notification({ title: 'Capture Screen - Error encountered', body: err }).show()
  //       })
  //   })
  //   return screenCaptured
  // } catch (error) {
  //   console.error('Error capturing the screen:', error)
  //   return false
  // }
}

// export async function captureScreen(): Promise<Buffer | boolean> {
//   try {
//     const cursorPoint = screen.getCursorScreenPoint()
//     let monitor = Monitor.fromPoint(cursorPoint.x, cursorPoint.y)

//     if (monitor) {
//       const img = await (await monitor.captureImage()).toPng()
//       const resizedBuffer = await sharp(img)
//         .resize({ width: Math.floor(monitor.width), height: Math.floor(monitor.height) })
//         .webp({ quality: 90 })
//         .toBuffer()
//       console.log('screenshot captured')
//       return resizedBuffer
//     } else {
//       console.error('Error capturing the screen: Monitor not found')
//       return false
//     }
//   } catch (error) {
//     console.error('Error capturing the screen:', error)
//     return false
//   }
// }
