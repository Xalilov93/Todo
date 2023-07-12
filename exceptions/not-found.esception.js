export class NotFoundException extends Error {
    constructor() {
        super()
        this.message = 'Not found'
        this.name = 'NotFoundException'
    }
}