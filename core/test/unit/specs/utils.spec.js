import { formatTime } from '@/utils'

describe('formatTime', () => {
  it('format seconds to harmony pattern', () => {
    expect(formatTime(30)).toEqual('00:30')
    expect(formatTime(60)).toEqual('01:00')
    expect(formatTime(90)).toEqual('01:30')
    
    expect(formatTime(33)).toEqual('00:33')
    expect(formatTime(68)).toEqual('01:08')
    expect(formatTime(125)).toEqual('02:05')

    expect(formatTime(3600)).toEqual('01:00:00')
    expect(formatTime(3675)).toEqual('01:01:15')
  })
})
