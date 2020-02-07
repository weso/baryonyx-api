package com.baryonyx.client.ClientJava.requests.put;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.json.simple.JSONObject;

public class PutRequest {

	private static final HttpClient httpClient = HttpClient.newBuilder().version(HttpClient.Version.HTTP_2).build();
	private final static String BASE_URL = "http://localhost:8443";

	public static void main(String[] args) throws IOException, InterruptedException {
		String allergiesID = "2";
		String propietarios = "7777";
		String names = "555";
		String descriptions = "descr actualizada";
		String clientID = "66GG";
		updateAllergy(clientID, allergiesID, propietarios, names, descriptions);
	}

	/**
	 * updates an allergy of a user
	 * 
	 * @param clientID             the client's ID
	 * @param allergyIDs           array of ids of allergies
	 * @param allergiesName        arrays of names of allergies
	 * @param allergiesDescription arrays of descriptions of allergies
	 * @throws IOException
	 * @throws InterruptedException
	 */
	@SuppressWarnings("unchecked")
	public static void updateAllergy(String clientID, String allergyID, String propietario, String allergyName,
			String allergyDescription) throws IOException, InterruptedException {

		JSONObject json = new JSONObject();

		json.put("idcl", clientID);
		json.put("idal", allergyID);
		json.put("idpr", propietario);
		json.put("name", allergyName);
		json.put("description", allergyDescription);

		// add json header
		HttpRequest request = HttpRequest.newBuilder().PUT(HttpRequest.BodyPublishers.ofString(json.toJSONString()))
				.uri(URI.create(BASE_URL + "/symmetry/allergy"))
				.setHeader("User-Agent", "PUT update Allergy for user from API") // header
				.header("Content-Type", "application/json").build();

		HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

		// print status code
		System.out.println(response.statusCode());

		// print response body
		System.out.println(response.body());
	}
}
