package com.baryonyx.client.ClientJava.requests.post;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class PostRequest {

	private static final HttpClient httpClient = HttpClient.newBuilder().version(HttpClient.Version.HTTP_2).build();
	private final static String BASE_URL = "http://localhost:8443";

	public static void main(String[] args) throws IOException, InterruptedException {
		String[] allergiesID = { "1", "2", "3" };
		String[] names = { "name1", "name2", "name3" };
		String[] descriptions = { "descr1", "descr2", "descr3" };
		String clientID = "66GG";
		createAllergyFor(clientID, allergiesID, names, descriptions);
	}

	@SuppressWarnings("unchecked")
	public static void createAllergyFor(String clientID, String[] allergyIDs, String[] allergiesName,
			String[] allergiesDescription) throws IOException, InterruptedException {

		JSONObject json = new JSONObject();

		json.put("idcl", clientID);
		appendJSONArray(json, "idal", allergyIDs);
		appendJSONArray(json, "allergy", allergiesName);
		appendJSONArray(json, "description", allergiesDescription);

		// add json header
		HttpRequest request = HttpRequest.newBuilder().POST(HttpRequest.BodyPublishers.ofString(json.toJSONString()))
				.uri(URI.create(BASE_URL + "/symmetry/write"))
				.setHeader("User-Agent", "POST create Allergy for user from API") // header
				.header("Content-Type", "application/json").build();

		HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

		// print status code
		System.out.println(response.statusCode());

		// print response body
		System.out.println(response.body());

	}

	@SuppressWarnings("unchecked")
	private static JSONObject appendJSONArray(JSONObject allergy, String param, String[] array) {
		JSONArray elements = new JSONArray();
		for (String element : array) {
			elements.add(element);
		}
		allergy.put(param, elements);
		return allergy;
	}

}
