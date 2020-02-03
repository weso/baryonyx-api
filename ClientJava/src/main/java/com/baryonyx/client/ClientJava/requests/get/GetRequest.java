package com.baryonyx.client.ClientJava.requests.get;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.function.BiConsumer;

public class GetRequest {

	private final static HttpClient httpClient = HttpClient.newBuilder().version(HttpClient.Version.HTTP_2).build();
	private final static String BASE_URL = "http://localhost:8443";

	public static void main(String[] args) throws IOException, InterruptedException {
		String clientID = "66GG";
		sendGET(clientID);
	}

	public static void sendGET(String userID) throws IOException, InterruptedException {

		HttpRequest request = HttpRequest.newBuilder().GET().uri(URI.create(BASE_URL + "/symmetry/alergias/" + userID))
				.setHeader("User-Agent", "Get Allergies from API") // add request header
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

		// print response body
		System.out.println(response.body());
	}

}
