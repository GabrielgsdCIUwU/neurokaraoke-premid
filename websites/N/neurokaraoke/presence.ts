import { ActivityType, Assets } from 'premid'

const presence = new Presence({
  clientId: '1462884935441322055',
})

const DEFAULT_BANNER = 'https://storage.neurokaraoke.com/image/banner/neuro_og.png'
let startTimestamp = Math.floor(Date.now() / 1000)
let lastTitle: string | null = null


presence.on('UpdateData', async () => {

  const player = document.querySelector('.global-player')
  const titleElement = player?.querySelector('p.mud-typography-body2')
  const artistElement = player?.querySelector('span.mud-typography-caption')
  const audioElement = document.querySelector('audio') as HTMLAudioElement
  const coverElement = player?.querySelector('.lazy-media-image') as HTMLImageElement

  const title = titleElement?.textContent?.trim()
  const artist = artistElement?.textContent?.trim()


  if (!title || !audioElement || title === "No song playing") {
    presence.clearActivity()
    return
  }

  if (title !== lastTitle) {
    lastTitle = title
  }

  const isPaused = audioElement.paused
  let coverUrl = coverElement?.src || DEFAULT_BANNER

  const presenceData: PresenceData = {
    type: ActivityType.Listening,
    details: title,
    state: `by ${artist || 'Unknown Artist'}`,
    largeImageKey: coverUrl,
    largeImageText: title,
    smallImageKey: isPaused ? Assets.Pause : Assets.Play,
    smallImageText: isPaused ? 'Paused' : 'Playing',
    startTimestamp
  }

  if (!isPaused && audioElement.duration > 0) {
    const now = Math.floor(Date.now() / 1000)
    const startTimestamp = now - Math.floor(audioElement.currentTime)
    const endTimestamp = startTimestamp + Math.floor(audioElement.duration)

    presenceData.startTimestamp = startTimestamp
    presenceData.endTimestamp = endTimestamp

  } else {
    delete presenceData.startTimestamp
    delete presenceData.endTimestamp
  }

  presence.setActivity(presenceData)
})
