@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    public ClientService(ClientRepository clientRepository, ClientMapper clientMapper) {
        this.clientRepository = clientRepository;
        this.clientMapper = clientMapper;
    }

    public List<ClientResponse> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(clientMapper::toResponse)
                .toList();
    }

    public ClientResponse createClient(CreateClientRequest request) {

        if(clientRepository.existsByEmail(request.email())){
            throw new ClientAlreadyExistsException(request.email());
        }

        Client client = clientMapper.toEntity(request);

        Client savedClient = clientRepository.save(client);

        return clientMapper.toResponse(savedClient);
    }

    public ClientResponse getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ClientNotFoundException(id));

        return clientMapper.toResponse(client);
    }

    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new ClientNotFoundException(id);
        }
        clientRepository.deleteById(id);
    }

    public ClientResponse updateClient(Long id, UpdateClientRequest request) {

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ClientNotFoundException(id));


        if (request.firstName() != null) {
            client.setFirstName(request.firstName());
        }

        if (request.lastName() != null) {
            client.setLastName(request.lastName());
        }

        if (request.email() != null) {

            if (!client.getEmail().equals(request.email())
                    && clientRepository.existsByEmail(request.email())) {
                throw new ClientAlreadyExistsException(request.email());
            }

            client.setEmail(request.email());
        }


        Client updatedClient = clientRepository.save(client);

        return clientMapper.toResponse(updatedClient);
    }
}