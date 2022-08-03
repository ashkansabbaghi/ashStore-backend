import { getAllBlogs } from "../src/controllers/blog.controllers.js"

describe("test get all blogs", async () => {
    it('response get api blogs', () => {
        const req = ""
        const res = {}

        await getAllBlogs(req, res)
        expect(res.text).toEqual("hello withMessage")
    })
})