// Write your tests here
const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')
beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})

describe('Get Jokes', () => {
  it('Boots unauthorized users', () => {
    return request(server).get('/api/jokes')
      .expect(401)
  })

})