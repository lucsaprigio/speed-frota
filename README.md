### Speed frota

# Finalidade

A aplicação vai ter como finalidade, de registrar acontecimentos e serviços de um determinado automóvel em uma frota.

# Regras de negócio

- No primeiro acesso, o usuário terá que enviar os dados do aparelho, e o Nome para a retaguarda
- O usuário fará o login localmente, terá que verificar a sincronização do aparelho

# Dados

## Dados do usuário

- Id (Único)
- Nome
- Senha
- Mac do aparelho

# Dados do Automóvel

- Id
- Descrição
- Placa

# Dados do Serviço

- Id
- Descrição 
- Valor
- Quantidade
- Total
- Coordenada
- Imagem (Opcional)

# Desenvolvimento

- Será feito a comunicação através de arquivos TXT.
- O aparelho sincronizará os dados de acordo com um time que será definido, para salvar no armazenamento local do aparelho
- Terá que ter um Backend para fazer essa leitura de arquivo e mandar para o aparelho
