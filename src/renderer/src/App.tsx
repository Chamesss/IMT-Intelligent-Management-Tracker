import Routing from './routes'

export default function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return <Routing />
}
