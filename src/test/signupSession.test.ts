import { describe, it, expect, beforeEach } from "vitest";
import { 
  createSignupSession, 
  getSignupSession, 
  clearSignupSession,
  updateQuestionnaireAnswers,
  prepareForDatabaseInsert 
} from "@/lib/signupSession";

describe("signupSession", () => {
  beforeEach(() => {
    clearSignupSession();
  });

  it("should create a signup session with trip type", () => {
    createSignupSession("surprise", "/");
    const session = getSignupSession();
    
    expect(session).not.toBeNull();
    expect(session?.tripType).toBe("surprise");
    expect(session?.sourcePage).toBe("/");
  });

  it("should store questionnaire answers", () => {
    createSignupSession("surprise", "/");
    updateQuestionnaireAnswers({
      interests: ["beaches", "mountains"],
      budget_min: 15000,
      budget_max: 50000,
    });
    
    const session = getSignupSession();
    expect(session?.questionnaireAnswers.interests).toContain("beaches");
    expect(session?.questionnaireAnswers.budget_min).toBe(15000);
  });

  it("should prepare data for database insert", () => {
    createSignupSession("custom", "/custom-trip");
    updateQuestionnaireAnswers({
      activities: ["adventure"],
      budget_min: 20000,
      budget_max: 80000,
    });
    
    const data = prepareForDatabaseInsert();
    expect(data).not.toBeNull();
    expect(data?.tripType).toBe("custom");
    expect(data?.questionnaireAnswers.activities).toContain("adventure");
  });

  it("should clear session properly", () => {
    createSignupSession("group", "/trips/123");
    clearSignupSession();
    
    const session = getSignupSession();
    expect(session).toBeNull();
  });
});
