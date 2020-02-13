package com.baryonyx.client.ClientJava.requests.put;

import java.io.IOException;

import org.apache.http.HttpResponse;
import org.apache.http.client.fluent.Request;
import org.apache.http.entity.ContentType;
import org.apache.http.util.EntityUtils;
import org.json.simple.JSONObject;

public class PutRequest {

	private final static String BASE_URL = "http://192.168.99.100:8440";

	public static void main(String[] args) throws IOException, InterruptedException {
		String allergiesID = "2";
		String propietarios = "412341585F";
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

		// put body
		HttpResponse response = Request.Put(BASE_URL + "/symmetry/allergy")
				.bodyString(json.toJSONString(), ContentType.APPLICATION_JSON).execute().returnResponse();

		System.out.println(response.getStatusLine().getStatusCode());
		System.out.println(EntityUtils.toString(response.getEntity(), "UTF-8"));

	}
}
