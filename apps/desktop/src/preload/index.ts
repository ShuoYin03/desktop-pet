import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('desktopPet', {
  ping: () => 'meow'
});
