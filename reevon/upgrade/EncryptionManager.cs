namespace Reevon.Api.Encryption;

using System.Security.Cryptography;
using System.Text;

public class EncryptionManager
{
    public static string Encrypt(string plainText, string publicKey)
    {
        byte[] aesKey;
        byte[] aesIV;

        using (Aes aes = Aes.Create())
        {
            aesKey = aes.Key;
            aesIV = aes.IV;

            using (ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV))
            {
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);
                        cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
                        cryptoStream.FlushFinalBlock();

                        byte[] encryptedData = memoryStream.ToArray();
                        byte[] encryptedAesKey = EncryptAesKey(aesKey, publicKey);

                        byte[] combinedData = new byte[encryptedAesKey.Length + aesIV.Length + encryptedData.Length];
                        Buffer.BlockCopy(encryptedAesKey, 0, combinedData, 0, encryptedAesKey.Length);
                        Buffer.BlockCopy(aesIV, 0, combinedData, encryptedAesKey.Length, aesIV.Length);
                        Buffer.BlockCopy(encryptedData, 0, combinedData, encryptedAesKey.Length + aesIV.Length, encryptedData.Length);

                        return Convert.ToBase64String(combinedData);
                    }
                }
            }
        }
    }

public static string Decrypt(string encryptedData, string privateKey, string password)
{
    byte[] combinedData = Convert.FromBase64String(encryptedData);
    byte[] encryptedAesKey = new byte[256];
    byte[] aesIV = new byte[16];
    byte[] cipherText = new byte[combinedData.Length - encryptedAesKey.Length - aesIV.Length];

    Buffer.BlockCopy(combinedData, 0, encryptedAesKey, 0, encryptedAesKey.Length);
    Buffer.BlockCopy(combinedData, encryptedAesKey.Length, aesIV, 0, aesIV.Length);
    Buffer.BlockCopy(combinedData, encryptedAesKey.Length + aesIV.Length, cipherText, 0, cipherText.Length);

    byte[] aesKey = DecryptAesKey(encryptedAesKey, privateKey, password);

    using (Aes aesAlg = Aes.Create())
    {
        using (ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesKey, aesIV))
        {
            using (MemoryStream msDecrypt = new MemoryStream(cipherText))
            {
                using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                {
                    using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                    {
                        return srDecrypt.ReadToEnd();
                    }
                }
            }
        }
    }
}

private static byte[] DecryptAesKey(byte[] encryptedAesKey, string privateKey, string password)
{
    byte[] aesKey;

    using (RSA rsa = RSA.Create())
    {
        rsa.FromXmlString(privateKey);
        aesKey = DecryptAesKeyWithPassword(encryptedAesKey, rsa.ExportParameters(true), password);
    }

    return aesKey;
}

private static byte[] DecryptAesKeyWithPassword(byte[] encryptedAesKey, RSAParameters privateKey, string password)
{
    byte[] decryptedAesKey;

    using (Aes aes = Aes.Create())
    {
        byte[] salt = encryptedAesKey.Take(16).ToArray();
        byte[] iv = encryptedAesKey.Skip(16).Take(16).ToArray();
        byte[] encryptedKey = encryptedAesKey.Skip(32).ToArray();

        using (Rfc2898DeriveBytes deriveBytes = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256))
        {
            byte[] keyBytes = deriveBytes.GetBytes(32);

            using (ICryptoTransform decryptor = aes.CreateDecryptor(keyBytes, iv))
            {
                using (MemoryStream msDecrypt = new MemoryStream(encryptedKey))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (MemoryStream msPlaintext = new MemoryStream())
                        {
                            csDecrypt.CopyTo(msPlaintext);
                            decryptedAesKey = msPlaintext.ToArray();
                        }
                    }
                }
            }
        }
    }

    using (RSACryptoServiceProvider rsaProvider = new RSACryptoServiceProvider())
    {
        rsaProvider.ImportParameters(privateKey);
        decryptedAesKey = rsaProvider.Decrypt(decryptedAesKey, false);
    }

    return decryptedAesKey;
}


    private static byte[] EncryptAesKey(byte[] aesKey, string publicKey)
    {
        byte[] encryptedAesKey;

        using (RSA rsa = RSA.Create())
        {
            rsa.FromXmlString(publicKey);
            encryptedAesKey = rsa.Encrypt(aesKey, RSAEncryptionPadding.OaepSHA256);
        }

        return encryptedAesKey;
    }
    
}
