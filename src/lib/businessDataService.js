import supabase from './supabase';

const TABLE_NAME = 'business_data_4a2b9c1d8e';
const APP_FILES_BUCKET = 'app_files';

/**
 * Fetches business data from Supabase
 * @returns {Promise<Object>} Business data object
 */
export const fetchBusinessData = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    
    // If there's data, check if there's an associated app file
    if (data) {
      const appFile = await getLatestAppFile(data.id);
      if (appFile) {
        data.appFile = appFile;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching business data:', error);
    return null;
  }
};

/**
 * Gets the latest app file for a business
 * @param {string} businessId - The business ID
 * @returns {Promise<Object|null>} App file object or null
 */
export const getLatestAppFile = async (businessId) => {
  try {
    // First get the metadata
    const { data: fileData, error: fileError } = await supabase
      .from('app_files_4a2b9c1d8e')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (fileError || !fileData) return null;
    
    // Then get the actual file URL
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from(APP_FILES_BUCKET)
      .createSignedUrl(`${businessId}/${fileData.id}`, 60 * 60 * 24); // 24 hour signed URL
    
    if (storageError) throw storageError;
    
    return {
      ...fileData,
      url: storageData.signedUrl,
      name: fileData.file_name,
      type: fileData.file_type,
      size: fileData.file_size
    };
  } catch (error) {
    console.error('Error fetching app file:', error);
    return null;
  }
};

/**
 * Updates business data in Supabase
 * @param {Object} data - Business data to update
 * @returns {Promise<Object>} Updated business data
 */
export const updateBusinessData = async (data) => {
  try {
    // Check if we have existing data first
    let businessId;
    const { data: existingData, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select('id')
      .limit(1)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // Prepare the business data (without appFile)
    const { appFile, ...businessData } = data;
    
    // Format the data for database
    const formattedData = {
      business_name: businessData.businessName,
      description: businessData.description,
      app_url: businessData.appUrl,
      app_name: businessData.appName,
      website_url: businessData.websiteUrl,
      instagram_url: businessData.instagramUrl,
      facebook_url: businessData.facebookUrl,
      phone: businessData.phone,
      email: businessData.email,
      total_pandits: businessData.totalPandits,
      happy_customers: businessData.happyCustomers,
      updated_at: new Date().toISOString()
    };
    
    // If we have existing data, update it
    if (existingData) {
      businessId = existingData.id;
      const { data: updatedData, error } = await supabase
        .from(TABLE_NAME)
        .update(formattedData)
        .eq('id', businessId)
        .select()
        .single();
      
      if (error) throw error;
    } else {
      // Otherwise insert new data
      const { data: newData, error } = await supabase
        .from(TABLE_NAME)
        .insert(formattedData)
        .select()
        .single();
      
      if (error) throw error;
      businessId = newData.id;
    }
    
    // Handle app file upload if provided
    if (appFile && appFile.data) {
      await uploadAppFile(businessId, appFile);
    }
    
    // Return the updated data
    return await fetchBusinessData();
  } catch (error) {
    console.error('Error updating business data:', error);
    throw error;
  }
};

/**
 * Uploads an app file to Supabase
 * @param {string} businessId - The business ID
 * @param {Object} appFile - App file object with data, name, type, size
 * @returns {Promise<Object>} Uploaded file metadata
 */
export const uploadAppFile = async (businessId, appFile) => {
  try {
    // First, convert base64 to blob
    const base64Data = appFile.data.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    
    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, { type: appFile.type });
    
    // Insert file metadata first
    const { data: fileData, error: fileError } = await supabase
      .from('app_files_4a2b9c1d8e')
      .insert({
        business_id: businessId,
        file_name: appFile.name,
        file_type: appFile.type,
        file_size: appFile.size
      })
      .select()
      .single();
    
    if (fileError) throw fileError;
    
    // Then upload the actual file
    const fileId = fileData.id;
    const filePath = `${businessId}/${fileId}`;
    
    const { error: storageError } = await supabase
      .storage
      .from(APP_FILES_BUCKET)
      .upload(filePath, blob, {
        contentType: appFile.type,
        upsert: true
      });
    
    if (storageError) throw storageError;
    
    return fileData;
  } catch (error) {
    console.error('Error uploading app file:', error);
    throw error;
  }
};

/**
 * Transforms database format to app format
 */
export const transformDatabaseToAppFormat = (dbData) => {
  if (!dbData) return null;
  
  return {
    businessName: dbData.business_name,
    description: dbData.description,
    appUrl: dbData.app_url,
    appName: dbData.app_name,
    appFile: dbData.appFile,
    websiteUrl: dbData.website_url,
    instagramUrl: dbData.instagram_url,
    facebookUrl: dbData.facebook_url,
    phone: dbData.phone,
    email: dbData.email,
    totalPandits: dbData.total_pandits,
    happyCustomers: dbData.happy_customers
  };
};

/**
 * Initializes the database with default values if empty
 */
export const initializeDefaultBusinessData = async () => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('count')
    .limit(1);
  
  if (error) {
    console.error('Error checking business data:', error);
    return;
  }
  
  if (data && data.length === 0) {
    const defaultData = {
      businessName: 'PanditConnect',
      description: 'Connect with experienced and verified pandits for all your religious ceremonies and rituals. Find the perfect pandit for your needs.',
      appUrl: '',
      appName: 'PanditConnect App',
      websiteUrl: 'https://panditconnect.com',
      instagramUrl: 'https://instagram.com/panditconnect',
      facebookUrl: 'https://facebook.com/panditconnect',
      phone: '+91 9876543210',
      email: 'contact@panditconnect.com',
      totalPandits: 500,
      happyCustomers: 1000
    };
    
    await updateBusinessData(defaultData);
  }
};