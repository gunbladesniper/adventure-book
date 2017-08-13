import axios from 'axios'

export default class Session {
  constructor(){
    this.data = {
      user: null,
      sectionMeta: {}
    }
    this.listeners = []
  }
  isAuthenticated(){
    return !!this.data.user
  }
  startSession(user){
    this.data.user = user
  }
  createUser(user){
    return axios.post('/api/signup', user)
  }
  logIn(user){
    return axios.post('/api/login', user)
  }
  logOut(){
    this.data.user = null;
  }
  onUpdate(cb){
    this.listeners.push(cb)
  }
  update(){
    this.listeners.forEach(cb => {
      cb()
    })
  }
  saveStory(story, title){
    const { name } = this.data.user
    const payload = { title, content: story, name }
    return axios.post('/api/story', { story: payload })
  }
  fetchStory(id){
    return axios.get(`api/story/${id}`)
  }
  fetchStories(category){
    let request
    if(category){
      request = axios.get('/api/stories', { category })
    } else {
      request = axios.get('/api/stories')
    }
    request.then(response => {
      const stories = response.data.stories
      this.data.stories = stories || []
      this.update()
    })
  }
  get(key, defaultValue){
    return this.data[key] || defaultValue
  }
  getMetaForSection(section){
    if(this.data.sectionMeta[section.id]){
      return this.data.sectionMeta[section.id]
    } else {
      let meta = {
        hasChallenge: !!section.challenge,
        challengePassed: false
      }
      this.data.sectionMeta[section.id] = meta
      return meta
    }
  }
}
