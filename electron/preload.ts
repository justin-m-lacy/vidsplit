import { contextBridge } from 'electron'

// Safe exposure of Node features
contextBridge.exposeInMainWorld('api', {
	hello: () => 'world',
})