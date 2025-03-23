export async function createStripeCustomer(email: string, userId: string) {
  try {
    const response = await fetch("/api/stripe/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, userId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || "Errore durante la creazione del cliente in Stripe"
      );
    }

    const customer = await response.json();
    return customer.id;
  } catch (error) {
    console.error("Errore durante la creazione del cliente in Stripe:", error);
    throw error;
  }
}

export async function createStripeProduct(visitType: {
  name: string;
  shortDescription: string;
  price: number;
  features: string[];
  frequency: string;
}) {
  try {
    const response = await fetch("/api/stripe/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(visitType),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || "Errore durante la creazione del prodotto in Stripe"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Errore durante la creazione del prodotto in Stripe:", error);
    throw error;
  }
}

export async function updateStripeProduct(visitType: {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  features: string[];
  frequency: string;
}) {
  try {
    const response = await fetch("/api/stripe/products", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(visitType),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || "Errore durante l'aggiornamento del prodotto in Stripe"
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Errore durante l'aggiornamento del prodotto in Stripe:",
      error
    );
    throw error;
  }
}

export async function deleteStripeProduct(productId: string) {
  try {
    const response = await fetch(`/api/stripe/products?id=${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || "Errore durante l'eliminazione del prodotto in Stripe"
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Errore durante l'eliminazione del prodotto in Stripe:",
      error
    );
    throw error;
  }
}
