export class HashGenerator {
    static generate(len = 4) {
        let hash = ''
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789='
      
        for (let i = 0; i < len; i++)
          hash += possible.charAt(Math.floor(Math.random() * possible.length))
      
        return hash
    }
      
}