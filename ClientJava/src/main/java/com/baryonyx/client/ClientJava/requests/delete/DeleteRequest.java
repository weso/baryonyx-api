package com.baryonyx.client.ClientJava.requests.delete;

import java.io.IOException;

import org.apache.http.HttpResponse;
import org.apache.http.client.fluent.Request;
import org.apache.http.util.EntityUtils;

public class DeleteRequest {

	private final static String BASE_URL = "http://192.168.99.100:8440";

	public static void main(String[] args) throws IOException, InterruptedException {
		String clientID = "66GG";
		String allergyID = "3";
		// deleteAllergyFileFor(clientID); // Para pruebas, borrar
		// deleteUserFolder(clientID); // Para pruebas, borrar
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
		HttpResponse response = Request.Delete(BASE_URL + "/symmetry/file/allergy/" + clientID).execute()
				.returnResponse();
		System.out.println(response.getStatusLine().getStatusCode());
		System.out.println(EntityUtils.toString(response.getEntity(), "UTF-8"));
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
		HttpResponse response = Request.Delete(BASE_URL + "/symmetry/user/" + clientID).execute().returnResponse();
		System.out.println(response.getStatusLine().getStatusCode());
		System.out.println(EntityUtils.toString(response.getEntity(), "UTF-8"));
	}

	/**
	 * deletes an allergy of a user
	 * 
	 * @param clientID the user ID
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public static void deleteAllergy(String clientID, String allergyID) throws IOException, InterruptedException {
		HttpResponse response = Request.Delete(BASE_URL + "/symmetry/allergy/" + clientID + "/" + allergyID).execute()
				.returnResponse();
		System.out.println(response.getStatusLine().getStatusCode());
		System.out.println(EntityUtils.toString(response.getEntity(), "UTF-8"));
	}
}
