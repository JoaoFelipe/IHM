airports = [
	['CZS', 'Aeroporto Internacional de Cruzeiro do Sul', 'Cruzeiro do Sul', -7.5992, -72.7678],
	['RBR', 'Aeroporto Internacional de Rio Branco - Plácido de Castro', 'Rio Branco', -9.8696, -67.8945],
	['MCZ', 'Aeroporto Internacional Zumbi dos Palmares', 'Maceió', -9.51105, -35.79071],
	['MCP', 'Aeroporto Internacional de Macapá', 'Macapá', 0.05051, -51.07100],
	['TFF', 'Aeroporto de Tefé', 'Tefé', -3.3812, -64.7239],
	['TBT', 'Aeroporto Internacional de Tabatinga', 'Tabatinga', -4.25072, -69.93878],
	['MAO', 'Aeroporto Internacional Eduardo Gomes', 'Manaus', -3.03242, -60.04681],
	['LAZ', 'Aeroporto de Bom Jesusa da Lapa', 'Bom Jesus da Lapa', -13.26236, -43.40720],
	['IOS', 'Aeroporto Jorge Amado', 'Ilhéus', -14.81577, -39.03166],
	['PAV', 'Aeroporto de Paulo Afonso', 'Paulo Afonso',-9.39957, -38.24908],
	['SSA', 'Aeroporto Internacional Dep. Luís Eduardo Magalhães', 'Salvador', -12.91401, -38.33480],
	['BPS', 'Aeroporto de Porto Seguro', 'Porto Seguro', -16.43757, -39.07850],
	['FOR', 'Aeroporto Internacional Pinto Martins', 'Fortaleza', -3.77795, -38.53957],
	['JDO', 'Aeroporto Regional do Cariri', 'Juazeiro do Norte',-7.21988, -39.26958],
	['BSB', 'Aeroporto Internacional Presidente Juscelino Kubitscheck', 'Brasília', -15.8770, -47.9236],
	['VIX', 'Aeroporto Eurico de Aguiar Salles', 'Vitória', -20.25771, -40.28545],
	['GYN', 'Aeroporto Santa Genoveva', 'Goiânia', -16.63453, -49.21543],
	['IMP', 'Aeroporto de Imperatriz', 'Imperatriz', -5.53214, -47.45453],
	['SLZ', 'Aeroporto Internacional Marechal Cunha Machado', 'São Luís', -2.58758, -44.23534],
	['CGB', 'Aeroporto Internacional Marechal Rondon', 'Várzea Grande',-15.65250, -56.11952],
	['CGB', 'Aeroporto Internacional Marechal Rondon', 'Cuiabá',-15.65250, -56.11952],
	['CGR', 'Aeroporto Internacional de Campo Grande', 'Campo Grande',-20.47046, -54.67336],
	['CMG', 'Aeroporto Internacional de Corumbá', 'Corumbá',-19.01200, -57.66954],
	['PMG', 'Aeroporto Internacional de Ponta Porã', 'Ponta Porã',-22.5528, -55.7033],
	['UDI', 'Aeroporto Ten.-Cel. Av. César Bombonato', 'Uberlândia', -18.88824, -48.22625],
	['PLU', 'Aeroporto da Pampulha - Carlos Drummond de Andrade', 'Belo Horizonte', -19.85202, -43.94890],
	['SBPR', 'Aeroporto Carlos Prates', 'Belo Horizonte',-19.91039, -43.98995],
	['MOC', 'Aeroporto de Monte Claros', 'Monte Claros', -16.7087, -43.8185],
	['POO', 'Embaixador Walther Moreira Salles', 'Poços de Caldas', -21.8428, -46.5639],
	['UBA', 'Aeroporto Mário de Almeida Franco', 'Uberaba', -19.76521, -47.96408],
	['QAK', 'Aeroporto de Barbacena', 'Barbacena', -21.26818, -43.76035],
	['ATM', 'Aeroporto de Altamira', 'Altamira', -3.25201, -52.25130],
	['BEL', 'Aeroporto Internacional de Belém/Val de Cans', 'Belém',-1.38056, -48.47490],
	['MAB', 'Aeroporto de Marabá', 'Marabá', -5.36916, -49.13754],
	['CKS', 'Aeroporto de Carajás', 'Paraiapebas', -6.11890, -49.99932],
	['STM', 'Aeroporto Internacional de Santarém', 'Santarém', -2.42254, -54.79000],
	['JPA', 'Aeroporto Internacional Presidente Castro Pinto', 'Bayeux', -7.14895, -34.95032],
	['JPA', 'Aeroporto Internacional Presidente Castro Pinto', 'João Pessoa', -7.14895, -34.95032],
	['CPV', 'Aeroporto Presidente João Suassuna', 'Campina Grande', -7.27061, -35.89515],
	['LDB', 'Aeroporto Governador José Richa', 'Londrina', -23.33443, -51.12769],
	['CWB', 'Aeroporto Internacional Afonso Pena', 'São José dos Pinhais', -25.53601, -49.17198],
	['CWB', 'Aeroporto Internacional Afonso Pena', 'Curitiba', -25.53601, -49.17198],
	['BFH', 'Aeroporto do Bacacheri', 'Curitiba', -25.40021, -49.22901],
	['IGU', 'Aeroporto Internacional Cataratas', 'Foz do Iguaçu', -25.6014, -54.484],
	['PNZ', 'Aeroporto de Petrolina', 'Petrolina', -9.36784, -40.59552],
	['REC', 'Aeroporto Internacional de Guarapes Gilberto Freyre', 'Recife', -8.13275, -34.91865],
	['FEN', 'Aeroporto de Fernando de Noronha', 'Fernando de Noronha', -3.85554, -32.41982],
	['PHB', 'Aeroporto Internacional Prefeiro Dr. João Silva Filho', 'Parnaíba', -2.89375, -41.73097],
	['THE', 'Aeroporto Senador Petrônio Portella', 'Teresina', -5.06066, -42.82194],
	['CAW', 'Aeroporto de Campos dos Goytacazes', 'Campos dos Goytacazes', -21.68935, -41.31364],
	['MEA', 'Aeroporto de Macaé', 'Macaé', -22.34273, -41.76515],
	['CFB', 'Aeroporto de Cabo Frio', 'Cabo Frio', -22.929, -42.105],
	['GIG', 'Aeroporto Internacional do Rio de Janeiro - Antônio Carlos Jobim', 'Rio de Janeiro', -22.81181, -43.25090],
	['SDU', 'Aeroporto Santos Dumont', 'Rio de Janeiro', -22.91138, -43.16408],
	['ICAO', 'Aeroporto de Jacarepaguá', 'Rio de Janeiro', -22.98781, -43.37036],
	['NAT', 'Aeroporto Internacional Augusto Severo', 'Parnamirim', -5.90042, -35.24741],
	['NAT', 'Aeroporto Internacional Augusto Severo', 'Natal', -5.90042, -35.24741],
	['BGX', 'Aeroporto Internacional Comandante Gustavo Kraemer', 'Bagé', -31.39282, -54.11012],
	['PET', 'Aeroporto Internacional de Pelotas', 'Pelotas', -31.71629, -52.33005],
	['POA', 'Aeroporto Internacional Salgado Filho', 'Porto Alegre', -29.99384, -51.16900],
	['PVH', 'Aeroporto Internacional Governador Jorge Teixeira', 'Porto Velho', -8.71702, -63.90031],
	['JPR', 'Aeroporto José Coleto', 'Ji-Paraná', -10.87056, -61.84563],
	['BVB', 'Aeroporto Internacional de Boa Vista', 'Boa Vista', 2.84639, -60.68758],
	['FLN', 'Aeroporto Internacional Hercílio Luz', 'Florianópolis', -27.66521, -48.54243],
	['NVT', 'Aeroporto Internacional Ministro Victor Konder', 'Navegantes', -26.88047, -48.64740],
	['JOI', 'Aeroporto Lauro Carneiro de Loyola', 'Joinville', -26.22460, -48.79531],
	['CCM', 'Aeroporto Diomicio Freitas', 'Forquilinha', -28.72582, -49.42129],
	['MAE', 'Aeroporto Campo de Marte', 'São Paulo', -23.50900, -46.63461],
	['CGH', 'Aeroporto de Congonhas/São Paulo', 'São Paulo', -23.62811, -46.65583],
	['SJK', 'Aeroporto de São José dos Campos', 'São José dos Campos', -23.22758, -45.86159],
	['AJU', 'Aeroporto Internacional de Aracaju', 'Aracaju', -10.98421, -37.06790],
	['PMW', 'Aeroporto de Palmas', 'Palmas',-10.29037, -48.35581],
];

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}