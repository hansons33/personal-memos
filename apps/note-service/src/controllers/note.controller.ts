import { Controller, Post } from "@micro-memos/validation"

@Controller("/note")
export class NoteController {
    @Post("/add")
    async createNote() {}
}
