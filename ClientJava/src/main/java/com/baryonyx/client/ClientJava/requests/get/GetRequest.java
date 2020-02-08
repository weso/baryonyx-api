package com.baryonyx.client.ClientJava.requests.get;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.function.BiConsumer;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class GetRequest {

	private final static HttpClient httpClient = HttpClient.newBuilder().version(HttpClient.Version.HTTP_2).build();
	private final static String BASE_URL = "https://localhost:8443";

	public static void main(String[] args) throws IOException, InterruptedException, ParseException {
		String clientID = "66GG";
		sendGET(clientID);
	}

	public static void sendGET(String userID) throws IOException, InterruptedException, ParseException {
		HttpRequest request = HttpRequest.newBuilder().GET().uri(URI.create(BASE_URL + "/symmetry/allergy/" + userID))
				.setHeader("User-Agent", "Get Allergies for a user from API") // add request header
				.build();

		HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
		// print response headers
		HttpHeaders headers = response.headers();
		headers.map().forEach(new BiConsumer<String, List<String>>() {
			public void accept(String k, List<String> v) {
				System.out.println(k + ":" + v);
			}
		});

		// print status code
		System.out.println(response.statusCode());

		JSONParser parser = new JSONParser();
		JSONArray json = null;
		json = (JSONArray) parser.parse(response.body());

		for (int i = 0; i < json.size(); i++) {
			String id, propietarioID, nombre, descripcion;

			JSONObject alergia = (JSONObject) parser.parse(json.get(i).toString());

			// Extraemos los valores del JSON en forma de URI
			id = (String) ((JSONObject) alergia.get("?id")).get("value");
			propietarioID = (String) ((JSONObject) alergia.get("?propietario")).get("value");
			nombre = (String) ((JSONObject) alergia.get("?nombre")).get("value");
			descripcion = (String) ((JSONObject) alergia.get("?descripcion")).get("value");

			// Extraemos los valores de las URIS
			id = id.split("#")[1];
			propietarioID = propietarioID.split("/")[5];
			nombre = nombre.split("/")[5];
			descripcion = descripcion.split("/")[5];

			System.out.println(id);
			System.out.println(propietarioID);
			System.out.println(nombre);
			System.out.println(descripcion);
			// Creamos la alergia con estos datos y la metemos en un listado; la devolvemos
		}
	}

}
