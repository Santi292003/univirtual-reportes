import PocketBase from 'pocketbase'

const pb = new PocketBase('http://172.16.1.21:8091')
pb.autoCancellation(false)

export default pb
