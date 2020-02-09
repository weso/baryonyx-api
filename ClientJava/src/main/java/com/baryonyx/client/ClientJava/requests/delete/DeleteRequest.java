package com.baryonyx.client.ClientJava.requests.delete;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class DeleteRequest {

	private static final HttpClient httpClient = HttpClient.newBuilder().version(HttpClient.Version.HTTP_2).build();
	private final static String BASE_URL = "http://localhost:8440";

	public static void main(String[] args) throws IOException, InterruptedException {
		String clientID = "66GG";
		String allergyID = "3";
		//deleteAllergyFileFor(clientID); // Para pruebas, borrar
		//deleteUserFolder(clientID); // Para pruebas, borrar
		deleteAllergy(clientID, allergyID); // Para pruebas, borrar
	}

	/**
	 * deletes the allergy file from the user's folder
	 * 
	 * @param clientID the client's ID
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public static void deleteAllergyFileFor(String clientID) throws IOException, InterruptedException {
		// add json header
		HttpRequest request = HttpRequest.newBuilder().DELETE()
				.uri(URI.create(BASE_URL + "/symmetry/file/allergy/" + clientID))
				.setHeader("User-Agent", "DELETE allergy file for user from API") // header
				.header("Content-Type", "application/json").build();

		HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

		// print status code
		System.out.println(response.statusCode());

		// print response body
		System.out.println(response.body());
	}

	/**
	 * deletes the user folder from the base symmetry folder. NOTE: it can be
	 * deleted ONLY IF it's empty
	 * 
	 * @param clientID the user ID
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public static void deleteUserFolder(String clientID) throws IOException, InterruptedException {
		// add header
		HttpRequest request = HttpRequest.newBuilder().DELETE().uri(URI.create(BASE_URL + "/symmetry/user/" + clientID))
				.setHeader("User-Agent", "DELETE user folder from symmetry from API") // header
				.header("Content-Type", "application/json").build();

		HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

		// print status code
		System.out.println(response.statusCode());

		// print response body
		System.out.println(response.body());
	}

	/**
	 * deletes an allergy of a user
	 * 
	 * @param clientID the user ID
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public static void deleteAllergy(String clientID, String allergyID) throws IOException, InterruptedException {
		// add header
		HttpRequest request = HttpRequest.newBuilder().DELETE()
				.uri(URI.create(BASE_URL + "/symmetry/allergy/" + clientID + "/" + allergyID))
				.setHeader("User-Agent", "DELETE allergy of a user from symmetry from API") // header
				.header("Content-Type", "application/json").build();

		HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

		// print status code
		System.out.println(response.statusCode());

		// print response body
		System.out.println(response.body());
	}
}
