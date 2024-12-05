export default class EmailService {
    static renderEmailPage(data: {
        to: string[];
        title: string;
        body: string;
    }): string {
        const mail = data.to.join(', ') +
               '\n-----------\n' +
               data.title +
               '\n------------\n' +
               data.body;

        return `<textarea cols="80" rows="40"></textarea>
                <script>document.querySelector('textarea').value = \`${mail}\`</script>`;
    }
}
